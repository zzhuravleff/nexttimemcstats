import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lduzndpbosjjueruqqee.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkdXpuZHBib3NqanVlcnVxcWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNTQ5ODYsImV4cCI6MjAzNjczMDk4Nn0.rvC9GV8-HlWYQNgpU_OjPimcqpV0YLtwWPacAy7UvXA';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const fetchAndWriteData = async () => {
  try {
    console.log('Fetching data from API...');
    const response = await axios.get('https://api.mcstatus.io/v2/status/java/play.nexttime-mc.online');
    console.log('Data received from API:');
    const data = response.data;
    const online = data.players.online;

    // Записываем данные в таблицу Supabase
    const { data: supabaseData, error } = await supabaseClient
      .from('stats')
      .insert({ value: online, ...data })

    console.log(online);

    if (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteOldData = async () => {
  try {
    const date = new Date(Date.now() - 86400000);
    const isoDate = date.toISOString();

    const { data: supabaseData, error } = await supabaseClient
      .from('stats')
      .delete()
      .lt('created_at', isoDate);

    if (error) {
      console.error(error);
      console.log('1');
    }
  } catch (error) {
    console.error(error);
    console.log('2');
  }
};

const cronJobFetchData = async () => {
  try {
    console.log('Cron job started');
    await fetchAndWriteData();

    // Отправляем запрос на cron-job.org
    await axios.post('https://cron-job.org/en/jobs/your-job-id', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        // данные, которые будут переданы в запросе
      }),
    });

    await cronJobFetchData();
  } catch (error) {
    console.error(error);
  }
};

const cronJobDeleteOldData = async () => {
  try {
    console.log('Delete old data cron job started');
    await deleteOldData();

    // Отправляем запрос на cron-job.org
    await axios.post('https://cron-job.org/en/jobs/your-job-id', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        // данные, которые будут переданы в запросе
      }),
    });

    await cronJobDeleteOldData();
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await cronJobFetchData();
  await cronJobDeleteOldData();
})();


export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </main>
  );
}