# Piano Virtual - Dự án Piano Ảo

Một ứng dụng piano ảo hoàn chỉnh với giao diện đẹp mắt và nhiều tính năng thú vị.

## 🎹 Tính năng chính

### 1. Piano Ảo
- **88 phím đầy đủ** (A0 đến C8) với giao diện tự động scale
- Chơi piano bằng bàn phím máy tính hoặc click chuột
- **Octave mapping thông minh**: Hàng A→; (octave hiện tại), Z→/ (octave -1)
- **Phím tắt**: 0-8 chọn octave trực tiếp, Space cho Sustain
- Giao diện đẹp mắt với hiệu ứng động và visual feedback
- **Ghi âm đa track** (3 tracks) với export/import JSON và MIDI
- **Metronome** với BPM và time signature tùy chỉnh
- **MIDI input** hỗ trợ bàn phím MIDI ngoài
- **Volume control** và điều chỉnh octave
- **Help modal** hiển thị tất cả phím tắt (nhấn H)

### 2. Bài Mẫu
- **10+ bài hát** đa dạng (cổ điển, pop, thiếu nhi)
- **Tutor mode**: Chờ người chơi bấm đúng nốt mới tiếp tục, chấm điểm độ chính xác
- Chế độ tự động phát với hướng dẫn từng nốt
- Điều chỉnh tốc độ phát (50%-150%)
- **Progress bar** với thời gian hiển thị
- **Tìm kiếm và lọc** theo độ khó, yêu thích
- **Đánh dấu yêu thích** với localStorage
- **Volume control** riêng cho bài hát
- Mini piano keyboard (C3-B5) để tập theo

### 3. Karaoke
- Hát theo lời bài hát với piano ảo
- Hiển thị lời từng từ một cách sinh động
- Nhiều bài hát karaoke khác nhau
- Đồng bộ lời và nhạc

### 4. Phân Tích Âm Thanh
- Tải lên file âm thanh hoặc ghi âm trực tiếp
- Phân tích và chuyển đổi thành nốt nhạc piano
- Xuất kết quả phân tích
- Phát lại bằng piano ảo

## 🚀 Cách sử dụng

### Cài đặt
1. Tải toàn bộ thư mục dự án
2. Đảm bảo có thư mục `Piano` chứa các file âm thanh (.mp3)
3. Mở file `index.html` trong trình duyệt web

### Điều khiển Piano
- **Hàng giữa (A → ;)**: Octave hiện tại (C, D, E, F, G, A, B...)
- **Hàng dưới (Z → /)**: Octave -1 (thấp hơn 1 quãng 8)
- **Số 0-8**: Chọn octave trực tiếp (0 = A0, 4 = A4, 8 = A8)
- **Space**: Bật/tắt Sustain (giữ nốt)
- **H**: Hiển thị bảng phím tắt
- **Click chuột**: Nhấp vào phím để chơi

### Ghi âm
1. **Ghi âm đơn**: Nhấn "Ghi âm" → chơi → "Dừng" → "Phát lại"
2. **Ghi âm đa track**:
   - Chọn track (1, 2, hoặc 3)
   - Nhấn "Ghi Track" → chơi → "Dừng"
   - Lặp lại cho các track khác
   - "Phát tất cả" để nghe tất cả tracks cùng lúc
3. **Export/Import**:
   - Export JSON để lưu bản ghi
   - Export MIDI (SMF Type 1) để dùng với phần mềm khác
   - Import JSON để tải lại bản ghi đã lưu

### Bài Mẫu
1. Chọn một bài hát từ danh sách
2. Nhấn "Chơi" để bắt đầu
3. Sử dụng các nút điều khiển để tạm dừng, dừng, hoặc thay đổi tốc độ
4. Theo dõi nốt hiện tại và nốt tiếp theo

### Phân Tích Âm Thanh
1. Chọn "Tải lên file" hoặc "Ghi âm trực tiếp"
2. Nhấn "Phân tích" để xử lý âm thanh
3. Xem kết quả phân tích
4. Phát lại hoặc xuất kết quả

## 📁 Cấu trúc dự án

```
Piano Virtual/
├── index.html              # Trang chủ
├── pages/
│   ├── piano.html          # Trang piano (88 phím)
│   ├── songs.html          # Trang bài mẫu
│   ├── karaoke.html        # Trang karaoke
│   └── analyzer.html       # Trang phân tích âm thanh
├── css/
│   └── styles.css          # CSS chung (dark mode, responsive)
├── js/
│   ├── script.js           # JavaScript chung (theme, utils)
│   ├── piano.js            # Piano logic (recording, MIDI, metronome)
│   ├── songs.js            # Songs logic (tutor mode, search)
│   ├── karaoke.js          # Karaoke logic
│   └── analyzer.js         # Audio analysis logic
├── assets/
│   └── audio/              # 88 file âm thanh (1.mp3 - 88.mp3)
│       ├── 1.mp3           # A0
│       ├── 2.mp3           # A#0
│       └── ...             # ... đến C8 (88.mp3)
└── README.md               # Hướng dẫn này
```

## 🎵 Danh sách bài hát

### Bài Mẫu Piano:
1. **Twinkle Twinkle Little Star** - Bài hát thiếu nhi (Dễ)
2. **Happy Birthday** - Chúc mừng sinh nhật (Dễ)
3. **Mary Had a Little Lamb** - Bài hát dân gian Mỹ (Dễ)
4. **Jingle Bells** - Giáng sinh (Dễ)
5. **Ode to Joy** - Beethoven (Trung bình)
6. **Canon in D** - Pachelbel (Trung bình)
7. **Für Elise** - Beethoven (Khó)
8. **Lạc Trôi** - Sơn Tùng M-TP (Trung bình)
9. **Hãy Trao Cho Anh** - Sơn Tùng M-TP (Trung bình)
10. **Chúng Ta Của Hiện Tại** - Sơn Tùng M-TP (Trung bình)
11. **Em Của Ngày Hôm Qua** - Sơn Tùng M-TP (Trung bình)
12. **Nơi Này Có Anh** - Sơn Tùng M-TP (Trung bình)

### Karaoke:
1. **Bài Hát Có Lời** - Bài hát tiếng Việt với lời đầy đủ
2. **Twinkle Twinkle** - Karaoke tiếng Anh
3. **Happy Birthday** - Karaoke sinh nhật

## 🔧 Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Hỗ trợ HTML5 Audio API
- Microphone (cho chức năng ghi âm)
- Kết nối internet (để tải font và icon)

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- Desktop
- Tablet
- Mobile

## 🎨 Giao diện

- Thiết kế hiện đại với gradient màu sắc đẹp mắt
- **Dark mode** với persistence (lưu preference)
- Hiệu ứng động mượt mà (key press, button hover, shimmer)
- **Visual feedback**: Highlight phím khi chơi
- **Progress bar** với animation
- **Help modal** với keyboard shortcuts
- Giao diện thân thiện với người dùng
- **Responsive design** cho mobile/tablet/desktop

## ✨ Tính năng đã có

- ✅ 88 phím đầy đủ (A0-C8)
- ✅ Ghi âm đa track (3 tracks)
- ✅ Export/Import JSON và MIDI
- ✅ MIDI input support
- ✅ Metronome với BPM/time signature
- ✅ Tutor mode với chấm điểm
- ✅ Tìm kiếm và lọc bài hát
- ✅ Dark mode với persistence
- ✅ Volume control
- ✅ Keyboard shortcuts help
- ✅ Visual feedback và animations

## 🔮 Tính năng tương lai

- [ ] Sheet music display
- [ ] Chia sẻ bản ghi âm online
- [ ] Thêm nhiều bài hát hơn
- [ ] Chế độ học piano với gam màu
- [ ] Chế độ đa người chơi
- [ ] PWA support (offline mode)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

## 👨‍💻 Tác giả

Được phát triển với ❤️ cho những người yêu âm nhạc.

---

**Lưu ý**: Đây là phiên bản demo. Chức năng phân tích âm thanh sử dụng thuật toán đơn giản và có thể không chính xác 100%. Trong thực tế, việc phân tích âm thanh phức tạp hơn nhiều và cần các thuật toán AI/ML chuyên sâu.