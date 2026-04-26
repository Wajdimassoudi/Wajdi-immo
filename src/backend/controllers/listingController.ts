import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const createListing = async (req: any, res: Response) => {
  try {
    const listingData = { ...req.body, owner_id: req.user.id };
    
    // Handle images if they come from multer (Cloudinary URLs)
    if (req.files) {
      listingData.images = (req.files as any[]).map(file => file.path);
    } else {
      listingData.images = [];
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getListings = async (req: Request, res: Response) => {
  const { category, governorate, q } = req.query;
  
  try {
    let query = supabase
      .from('listings')
      .select('*, owner:profiles(id, name)');

    if (category) query = query.eq('category', category);
    if (governorate) query = query.eq('governorate', governorate);
    if (q) query = query.ilike('title', `%${q}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, owner:profiles(*)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ message: 'Listing not found' });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req: any, res: Response) => {
  try {
    const { data: listing, error: findError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', req.params.id)
      .single();

    if (findError || !listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
    res.json({ message: 'Listing removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
