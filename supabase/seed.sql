-- ============================================================
--  DATA AWAL (SEED) - Master Cabang Olahraga Puslatkot
--  Jalankan setelah schema.sql
-- ============================================================

insert into public.cabor (nama, kode, deskripsi, latitude, longitude, radius_m) values
('Atletik',          'ATL', 'Lari pendek, middle, panjang, hurdles, relay',            -7.2570, 112.7520, 250),
('Badminton',        'BDM', 'Tunggal ganda, ganda campuran',                            -7.2570, 112.7520, 200),
('Bola Basket',      'BSK', 'LIMA',                                                    -7.2570, 112.7520, 200),
('Bola Futsal',      'BFS', 'Futsal competitiveness',                                  -7.2570, 112.7520, 200),
('Bola Sepak',       'BSF', 'Sepak bola',                                              -7.2570, 112.7520, 300),
('Bola Voli',        'BVL', 'Voli indoor',                                             -7.2570, 112.7520, 200),
('Bulu Tangkis',     'BLT', 'Alias badminton',                                         -7.2570, 112.7520, 200),
('Cabang Tunggal',   'CTG', 'Cabang tunggal',                                          -7.2570, 112.7520, 200),
('Dayung',           'DYG', 'Kanu, dayung',                                            -7.2570, 112.7520, 300),
('Futsal',           'FTS', 'Futsal',                                                 -7.2570, 112.7520, 200),
('Gerak',            'GRK', 'Senam, aerobic, zumba',                                   -7.2570, 112.7520, 200),
('Gymnastic',        'GYM', 'Senam Artistic, rhythmic, trampoline',                    -7.2570, 112.7520, 200),
('Hoki',             'HKI', 'Hoki',                                                   -7.2570, 112.7520, 200),
('Judo',             'JDO', 'Judo',                                                   -7.2570, 112.7520, 200),
('Karate',           'KRT', 'Karate',                                                 -7.2570, 112.7520, 200),
('Kurbo',            'KRB', 'Lari cepat',                                             -7.2570, 112.7520, 250),
('Muay Thai',        'MTH', 'Muay Thai',                                              -7.2570, 112.7520, 200),
('Pencak Silat',     'PCS', 'Pencak silat',                                           -7.2570, 112.7520, 200),
('Pesta Dayung',     'PDY', 'Pesta dayung',                                           -7.2570, 112.7520, 300),
('Renang',           'RNG', 'Renang',                                                 -7.2570, 112.7520, 200),
('Panjangan',        'PNJ', 'Panjangan',                                              -7.2570, 112.7520, 200),
('Panque',           'PNQ', 'Panque silat',                                           -7.2570, 112.7520, 200),
('Tennis',           'TNS', 'Tennis',                                                 -7.2570, 112.7520, 200),
('Taekwondo',        'TKD', 'Taekwondo',                                              -7.2570, 112.7520, 200),
('Tinju',            'TNJ', 'Tinju',                                                  -7.2570, 112.7520, 200),
('Voli',             'VLI', 'Voli',                                                  -7.2570, 112.7520, 200),
('Weightlifting',    'WLG', 'Angkat beban',                                           -7.2570, 112.7520, 200),
('Tenis Meja',       'TNM', 'Tenis meja',                                             -7.2570, 112.7520, 200),
('Panahan',          'PNA', 'Panahan',                                                -7.2570, 112.7520, 300)
on conflict (kode) do nothing;
