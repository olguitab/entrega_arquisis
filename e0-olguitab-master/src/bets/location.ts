// src/utils/getLocationFromIP.ts
import axios from 'axios';
export async function getLocationFromIP(ipAddress: string): Promise<any> {
  const apiKey = 'f2567712b9774e731830e0cb320ba936';
  const url = `https://api.ipapi.com/190.215.229.148?access_key=${apiKey}&format=1`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la ubicación desde la IP:', error);
    throw new Error('No se pudo obtener la ubicación');
  }
}