import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

export default async function handler(res) {
  try {
    // Fetch data from API
    const response = await axios.get('https://api.mcstatus.io/v2/status/java/play.nexttime-mc.online');
    const data = response.data;
    const online = data.players.online;

    // Write data to Supabase
    const supabaseUrl = 'https://lduzndpbosjjueruqqee.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkdXpuZHBib3NqanVlcnVxcWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNTQ5ODYsImV4cCI6MjAzNjczMDk4Nn0.rvC9GV8-HlWYQNgpU_OjPimcqpV0YLtwWPacAy7UvXA';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: supabaseData, error } = await supabaseClient
      .from('stats')
      .insert({ value: online, ...data })

    console.log(online);

    if (error) {
      console.error(error);
    }

    // Delete old data (more than 1 day)
    const oneDayAgo = new Date(Date.now() - 86400000); // 86400000 - milliseconds in a day
    const { data: oldData, error: oldError } = await supabaseClient
      .from('stats')
      .delete()
      .eq('created_at', { lt: oneDayAgo.toISOString() });

    if (oldError) {
      console.error(oldError);
    }
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({ message: 'Cron Job completed successfully' });
}