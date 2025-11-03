# Piano Virtual - Dự án Piano Ảo

Một ứng dụng piano ảo hoàn chỉnh với giao diện đẹp mắt và nhiều tính năng thú vị.

## 🎹 Tính năng chính

### 1. Piano Ảo
- Chơi piano bằng bàn phím máy tính hoặc click chuột
- Giao diện đẹp mắt với hiệu ứng động cho từng phím
- Chức năng ghi âm và phát lại
- Hiển thị nốt nhạc hiện tại

### 2. Bài Mẫu
- Nhiều bài hát nổi tiếng để học
- Chế độ tự động phát với hướng dẫn từng nốt
- Điều chỉnh tốc độ phát (chậm/bình thường)
- Hiển thị nốt tiếp theo
- Tích hợp bài hát từ file có sẵn

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
- **Phím trắng**: A, S, D, F, G, H, J, K, L
- **Phím đen**: W, E, T, Y, U, O, P
- **Click chuột**: Nhấp vào phím để chơi

### Ghi âm
1. Nhấn nút "Ghi âm" để bắt đầu
2. Chơi các nốt nhạc
3. Nhấn "Dừng ghi âm" để kết thúc
4. Nhấn "Phát lại" để nghe bản ghi

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
├── index.html          # Trang chủ
├── piano.html          # Trang piano
├── songs.html          # Trang bài mẫu
├── karaoke.html        # Trang karaoke
├── analyzer.html       # Trang phân tích âm thanh
├── styles.css          # CSS chung
├── script.js           # JavaScript chung
├── piano.js            # JavaScript cho piano
├── songs.js            # JavaScript cho bài mẫu
├── karaoke.js          # JavaScript cho karaoke
├── analyzer.js         # JavaScript cho phân tích
├── Piano/              # Thư mục chứa file âm thanh
│   ├── 40.mp3         # C4
│   ├── 41.mp3         # C#4
│   ├── 42.mp3         # D4
│   └── ...            # Các nốt khác
└── README.md           # Hướng dẫn này
```

## 🎵 Danh sách bài hát

### Bài Mẫu Piano:
1. **Twinkle Twinkle Little Star** - Bài hát thiếu nhi nổi tiếng
2. **Happy Birthday** - Chúc mừng sinh nhật
3. **Mary Had a Little Lamb** - Bài hát dân gian Mỹ
4. **Für Elise** - Bản nhạc cổ điển của Beethoven
5. **Bài Hát Dài** - Bài hát từ file có sẵn với nhiều nốt nhạc

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
- Hiệu ứng động mượt mà
- Giao diện thân thiện với người dùng
- Hỗ trợ dark/light mode

## 🔮 Tính năng tương lai

- [ ] Thêm nhiều bài hát hơn
- [ ] Chế độ học piano với gam màu
- [ ] Chia sẻ bản ghi âm
- [ ] Tích hợp với MIDI
- [ ] Chế độ đa người chơi

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

## 👨‍💻 Tác giả

Được phát triển với ❤️ cho những người yêu âm nhạc.

---

**Lưu ý**: Đây là phiên bản demo. Chức năng phân tích âm thanh sử dụng thuật toán đơn giản và có thể không chính xác 100%. Trong thực tế, việc phân tích âm thanh phức tạp hơn nhiều và cần các thuật toán AI/ML chuyên sâu.