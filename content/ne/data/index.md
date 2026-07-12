---
title: "खुला डेटा र API"
ja_term: "Open data"
summary: "यो साइट चलाउने, मानिसले जाँचेको डेटा — निःशुल्क, कुनै key चाहिँदैन। CC BY 4.0।"
last_verified: "2026-07-13"
translated: "2026-07-13"
---

यो साइटका सबै सामग्री मानिसले जाँचेको संरचित डेटाबाट बनेका छन्। त्यो डेटा हामी
खुला रूपमा प्रकाशित गर्छौं — एप, अनुसन्धानकर्ता, अरू सहरहरू र AI सहायकहरूले
सिधै प्रयोग गर्न सक्छन्।

## JSON API

कुनै दर्ता वा प्रमाणीकरण चाहिँदैन। CORS सक्षम छ।

- [/api/procedures.json](/api/procedures.json) — सबै प्रक्रियाहरू (चरण, म्याद, जाँचिएका आधिकारिक लिङ्क)
- [/api/wards.json](/api/wards.json) — २३ वडाका कार्यालय र विदेशीहरूका परामर्श डेस्क
- [/api/glossary.json](/api/glossary.json) — सरकारी कागजका शब्दहरूको व्याख्या (५ भाषा)
- [/api/emergency.json](/api/emergency.json) — 119, #7119, बहुभाषिक हेल्पलाइन
- [/api/meta.json](/api/meta.json) — डेटा कति नयाँ छ भनी जाँच्न
- [OpenAPI](/api/openapi.yaml) · [JSON Schema](/api/procedures.schema.json)

हरेक डेटामा «मानिसले जाँचेको मिति» (`last_verified`) हुन्छ।

## Markdown संस्करण र llms.txt

कुनै पनि पृष्ठको URL को अन्त्यमा `index.md` थप्दा AI ले पढ्न सजिलो शुद्ध-पाठ संस्करण पाइन्छ
(उदाहरण: [/ne/moving-in/resident-registration/index.md](/ne/moving-in/resident-registration/index.md))।
AI का लागि सूची: [/llms.txt](/llms.txt) र [/llms-full.txt](/llms-full.txt)।

## MCP सर्भर

AI एजेन्टहरूले वेब खोज्नुको सट्टा यो डेटा सिधै प्रयोग गर्न सक्छन्:

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

प्याकेज: [@dror-jp/official-tokyo-mcp](https://www.npmjs.com/package/@dror-jp/official-tokyo-mcp)

## डेटा किन पुरानो हुँदैन

JSON, Markdown र HTML — सबै **एउटै स्रोतबाट** स्वतः बन्छन्।
पृष्ठ सच्याइएको क्षणमै डेटा पनि सच्चिन्छ।

## लाइसेन्स

डेटा: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — स्रोत:
*official.tokyo.jp (DroR Corporation)*। कोड:
[MIT, GitHub मा खुला](https://github.com/dror-jp/official.tokyo.jp)।
डेटाको संरचना जानाजान टोकियो-विशेष बनाइएको छैन — अरू सहरका लागि यो प्रणाली
सापटी (fork) लिन स्वागत छ।
