import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import type { Category, Subcategory, Item, Order } from '@/types'

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, 'categories')
  const q = query(categoriesRef, orderBy('order'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Category))
}

export const addCategory = async (categoryData: Omit<Category, 'id'>) => {
  const categoriesRef = collection(db, 'categories')
  return await addDoc(categoriesRef, categoryData)
}

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  const categoryRef = doc(db, 'categories', id)
  return await updateDoc(categoryRef, categoryData)
}

export const deleteCategory = async (id: string) => {
  const categoryRef = doc(db, 'categories', id)
  return await deleteDoc(categoryRef)
}

// Subcategories
export const getSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  const subcategoriesRef = collection(db, 'subcategories')
  let q = query(subcategoriesRef, orderBy('order'))
  
  if (categoryId) {
    q = query(subcategoriesRef, where('categoryId', '==', categoryId), orderBy('order'))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Subcategory))
}

export const addSubcategory = async (subcategoryData: Omit<Subcategory, 'id'>) => {
  const subcategoriesRef = collection(db, 'subcategories')
  return await addDoc(subcategoriesRef, subcategoryData)
}

export const updateSubcategory = async (id: string, subcategoryData: Partial<Subcategory>) => {
  const subcategoryRef = doc(db, 'subcategories', id)
  return await updateDoc(subcategoryRef, subcategoryData)
}

export const deleteSubcategory = async (id: string) => {
  const subcategoryRef = doc(db, 'subcategories', id)
  return await deleteDoc(subcategoryRef)
}

// Items
export const getItems = async (subcategoryId?: string): Promise<Item[]> => {
  const itemsRef = collection(db, 'items')
  let q = query(itemsRef, orderBy('order'))
  
  if (subcategoryId) {
    q = query(itemsRef, where('subcategoryId', '==', subcategoryId), orderBy('order'))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Item))
}

export const getItem = async (id: string): Promise<Item | null> => {
  const itemRef = doc(db, 'items', id)
  const snapshot = await getDoc(itemRef)
  
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as Item
  }
  
  return null
}

export const addItem = async (itemData: Omit<Item, 'id'>) => {
  const itemsRef = collection(db, 'items')
  return await addDoc(itemsRef, itemData)
}

export const updateItem = async (id: string, itemData: Partial<Item>) => {
  const itemRef = doc(db, 'items', id)
  return await updateDoc(itemRef, itemData)
}

export const deleteItem = async (id: string) => {
  const itemRef = doc(db, 'items', id)
  return await deleteDoc(itemRef)
}

// Orders
export const getOrders = async (status?: 'pending' | 'dispatched'): Promise<Order[]> => {
  const ordersRef = collection(db, 'orders')
  let q = query(ordersRef, orderBy('createdAt', 'desc'))
  
  if (status) {
    q = query(ordersRef, where('status', '==', status), orderBy('createdAt', 'desc'))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order))
}

export const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  const ordersRef = collection(db, 'orders')
  return await addDoc(ordersRef, {
    ...orderData,
    createdAt: serverTimestamp()
  })
}

// Helper functions for images
export const getItemImages = (item: Item): string[] => {
  // PRIORITY: Use images array if it exists and has content
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter(url => url && url.trim()) // Filter out empty strings
  }
  
  // FALLBACK: Use single imageUrl if available
  if (item.imageUrl && item.imageUrl.trim()) {
    return [item.imageUrl]
  }
  
  // DEFAULT: Use placeholder if nothing available
  return ['https://via.placeholder.com/400x400/F8D4DC/2C2C2C?text=No+Image']
}

export const getItemPrimaryImage = (item: Item): string => {
  const images = getItemImages(item)
  return images[0]
}

export const updateOrder = async (id: string, orderData: Partial<Order>) => {
  const orderRef = doc(db, 'orders', id)
  const updateData = { ...orderData }
  
  // If marking as dispatched, add timestamp
  if (orderData.status === 'dispatched') {
    updateData.dispatchedAt = serverTimestamp()
  }
  
  return await updateDoc(orderRef, updateData)
}