---
title: "Dữ liệu mở & API"
ja_term: "Open data"
summary: "Dữ liệu đã được con người kiểm chứng — miễn phí, không cần khóa. CC BY 4.0."
last_verified: "2026-07-13"
translated: "2026-07-13"
---

Toàn bộ nội dung trang web này được xây dựng từ dữ liệu có cấu trúc, do con người
kiểm chứng. Chúng tôi công khai dữ liệu đó để ứng dụng, nhà nghiên cứu, các thành phố
khác — và trợ lý AI — có thể dùng trực tiếp.

## JSON API

Không cần xác thực, không giới hạn tốc độ, hỗ trợ CORS.

- [/api/procedures.json](/api/procedures.json) — mọi thủ tục (các bước, thời hạn, liên kết chính thức đã kiểm chứng)
- [/api/wards.json](/api/wards.json) — 23 quận: văn phòng quận và quầy tư vấn cho người nước ngoài
- [/api/glossary.json](/api/glossary.json) — giải thích thuật ngữ trên giấy tờ chính thức (5 ngôn ngữ)
- [/api/emergency.json](/api/emergency.json) — 119, #7119, đường dây tư vấn đa ngôn ngữ
- [/api/meta.json](/api/meta.json) — kiểm tra độ mới của dữ liệu
- [OpenAPI](/api/openapi.yaml) · [JSON Schema](/api/procedures.schema.json)

Mỗi bản ghi đều có ngày kiểm chứng (`last_verified`).

## Bản Markdown & llms.txt

Thêm `index.md` vào cuối URL của bất kỳ trang nào để nhận bản thuần văn bản dễ đọc cho AI
(ví dụ: [/vi/moving-in/resident-registration/index.md](/vi/moving-in/resident-registration/index.md)).
Chỉ mục cho AI: [/llms.txt](/llms.txt) và [/llms-full.txt](/llms-full.txt).

## Máy chủ MCP

Các AI agent có thể gọi dữ liệu này như công cụ, thay vì tìm kiếm trên web:

```
{
  "mcpServers": {
    "official-tokyo": {
      "command": "npx",
      "args": ["-y", "@dror-jp/official-tokyo-mcp"]
    }
  }
}
```

Gói: [@dror-jp/official-tokyo-mcp](https://www.npmjs.com/package/@dror-jp/official-tokyo-mcp)

## Vì sao dữ liệu không bao giờ lỗi thời

JSON, bản Markdown và trang HTML đều được tạo tự động **từ cùng một nguồn** khi build.
Khi một trang được sửa, dữ liệu cũng được sửa cùng lúc.

## Giấy phép

Dữ liệu: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — ghi nguồn
*official.tokyo.jp (DroR Corporation)*. Mã nguồn:
[MIT, mở trên GitHub](https://github.com/dror-jp/official.tokyo.jp).
Cấu trúc dữ liệu cố ý không dành riêng cho Tokyo — hoan nghênh các thành phố khác sao chép (fork).
