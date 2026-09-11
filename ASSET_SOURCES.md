# แหล่งที่มาของไฟล์และภาพ

## ภาพจากโครงงานเดิม

`assets/kimchi-infographic.png` คัดลอกจากไฟล์ Infographic เดิมโดยไม่เปลี่ยนข้อมูลไฟล์ ใช้เป็นภาพ After ของโครงงานและเป็นไฟล์ดาวน์โหลดต้นฉบับ

`assets/images/infographic-before.webp` แปลงจากภาพผลลัพธ์แรกที่อยู่ในบทสนทนา ชื่อเดิม `a_detailed_infographic_style_photo_collage_on_a_ru.png`

ภาพ After แบบ WebP และภาพย่อ 640 / 960 เป็นสำเนาที่ปรับรูปแบบไฟล์เพื่อใช้บนเว็บไซต์ ไม่ได้สร้างเนื้อหาใหม่

`kimchi-hero.webp` และ `kimchi-detail.webp` เป็นการครอปภาพ Infographic เดิมเพื่อนำมาจัดวาง ไม่ใช่ภาพถ่ายจริงหรือภาพใหม่ที่สร้างขึ้นระหว่าง Redesign

## เอกสารเดิม

PDF และ `.tex` ทั้ง path เดิมและ path ใหม่คัดลอกจากโครงงานเดิม ตรวจสอบด้วย SHA-256 แล้วว่าตรงกับไฟล์ต้นฉบับ พรีวิว `article-page-1.webp` / `article-page-2.webp` เรนเดอร์จาก PDF ฉบับนั้นโดยตรง

## สไลด์เดิม

ไฟล์ `kimchi-project-presentation.pptx` คัดลอกจาก `kimchi-ai-homework-canva-ready.pptx` ของโครงงานเดิม

ภาพพรีวิว 4 ภาพมาจากสไลด์เดิมหมายเลข 1, 11, 13 และ 12 ตามลำดับ ไม่ได้สร้างหลักฐานหน้าจอของ NotebookLM หรือ Desmos ขึ้นใหม่

## กราฟและแผนภาพ

กราฟและ CSV คำนวณตามสมการที่ผู้ใช้กำหนด `p(x)=4.2+1.6e^(-0.32x)` และติดป้ายว่าเป็น Educational Model

SVG สำรองของกระบวนการจัดวางด้วยโค้ดตาม node และ edge ของ Mermaid เดิม ไม่ได้อ้างว่าเป็นไฟล์ส่งออกจาก Mermaid Renderer ปุ่ม Render Mermaid จะโหลดไลบรารีจริงเมื่อผู้ใช้สั่งและมีอินเทอร์เน็ต

## Typography / icons

ฟอนต์เว็บเรียกผ่าน Google Fonts พร้อม system fallback ไม่มีไฟล์ฟอนต์อยู่ในโปรเจกต์ ไอคอนเป็น SVG แบบเส้นที่เขียนไว้ใน HTML ไม่ต้องใช้ icon library


## 2026-09-09 update: supplied presentation PDF

- Source: user attachment `Mastering_Authentic_Kimchi.pdf`, 8 pages.
- Original download: `assets/pdf/Mastering_Authentic_Kimchi.pdf` (SHA-256: 6c88d9530dc151d2d460f75b94beade06285f0197adf70ad4415738c5594a97b).
- Page previews and thumbnails: `assets/slides/authentic-kimchi/`, rendered from that PDF with PDFium; no content retouching or new slides.
- English captions follow the slide headings. These are not a new verification of the slide's food-science statements.
- Previous four project previews and the existing PPTX remain in the package for backward compatibility.
- UI typography: Inter for Latin/numbers and Noto Sans Thai for Thai, requested via Google Fonts; no font binaries included.
