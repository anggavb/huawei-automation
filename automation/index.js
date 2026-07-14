import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// const TARGET_DIR = '/home/cron';
const TARGET_DIR = './cron';

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// ==========================================
// 1. SKRIP AUTOMATION: COLLECT DATA (08.00, 12.00, 15.00)
// ==========================================
// Pola Cron: 'menit jam hari-bulan bulan hari-minggu'
// 0 8,12,15 * * * artinya: Menit 0, Jam 8, 12, dan 15, setiap hari.
cron.schedule('0 8,12,15 * * *', async () => {
    console.log('Menjalankan tugas: Collect Data...');
    
    try {
        const now = new Date();
        
        // Format Date: MMddYYYY (Contoh: 12192024)
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const dateStr = `${month}${date}${year}`;
        
        // Format Hours: HH.mm (Contoh: 15.00)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}.${minutes}`;
        
        // Gabungkan jadi nama file: cron_12192024_15.00.csv
        const fileName = `cron_${dateStr}_${timeStr}.csv`;
        const filePath = path.join(TARGET_DIR, fileName);
        
        // Contoh simulasi penulisan data CSV
        const API_URL="https://worldcup26.ir/get/games"
        const data = await fetchData(API_URL);
        
        const csvContent = "id,home_team_name_en,away_team_name_en,local_date\n" + data.games.map(game => `${game.id},${game.home_team_name_en},${game.away_team_name_en},${game.local_date}`).join('\n');
        
        fs.writeFileSync(filePath, csvContent, 'utf-8');
        console.log(`Berhasil menyimpan file: ${fileName}`);
        
    } catch (error) {
        console.error('Gagal melakukan collect data:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta" // Memastikan berjalan sesuai waktu WIB
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw response.status

    return response.json()
  } catch (err) {
    console.log('Error', err);
  }
}


// ==========================================
// 2. SKRIP AUTOMATION: DATA CLEANSING (Setiap Hari Jam 00.00)
// ==========================================
cron.schedule('0 0 * * *', () => {
    console.log('Menjalankan tugas: Data Cleansing (Hapus file > 30 hari)...');
    
    try {
        const files = fs.readdirSync(TARGET_DIR);
        const now = new Date();
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 30 hari dalam milidetik

        files.forEach(file => {
            if (file.endsWith('.csv')) {
                const filePath = path.join(TARGET_DIR, file);
                const stats = fs.statSync(filePath);
                const fileAgeMs = now - stats.mtime; // Menghitung umur file berdasarkan waktu modifikasi terakhir

                if (fileAgeMs > oneMonthInMs) {
                    fs.unlinkSync(filePath);
                    console.log(`Dibersihkan: File ${file} telah dihapus karena berusia lebih dari sebulan.`);
                }
            }
        });
    } catch (error) {
        console.error('Gagal melakukan data cleansing:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});