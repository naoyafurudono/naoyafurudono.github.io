---
title: "GASでスライド生成"
date: 2023-10-01T23:29:39+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "tech"
    - "tool"
---

Google Slidesで作成したテンプレートファイルに文字列を置換する形でスライドを生成するスクリプトをChat GPTに書いてもらったのでメモ。

```aa
+--------------------------------+
|                                |
|  {{氏名}}                      |
|                                |
|                                |
|     {{住所}}                   |
+--------------------------------+
```

みたいなスライドを作って、

```csv
氏名,住所
佐藤太郎,日本のどこか
田中一郎,東京のどこか
```

みたいなスプレッドシートでスクリプトを実行すると以下のようなスライドをテンプレのあるスライドに追記する。


```aa
+--------------------------------+
|                                |
|  佐藤太郎                      |
|                                |
|                                |
|     日本のどこか               |
+--------------------------------+

+--------------------------------+
|                                |
|  田中一郎                      |
|                                |
|                                |
|     東京のどこか               |
+--------------------------------+
```

スクリプトは以下。

```gas
function createSlidesFromSheet() {
  var slideId = 'ここにスライドのIDを入れる'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var slide = SlidesApp.openById(slideId);
  var templateSlide = slide.getSlides()[0]; // テンプレートとして使う最初のスライドを取得
  
  var headers = data[0]; // ヘッダー行を取得

  // データ行をループ
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var newSlide = slide.appendSlide(templateSlide); // テンプレートスライドをコピー
    
    var shapes = newSlide.getShapes();
    for (var j = 0; j < shapes.length; j++) {
      var shape = shapes[j];
      var text = shape.getText().asString();
      
      // スプレッドシートのヘッダーを参照して、対応するデータでプレースホルダーを置き換える
      for (var k = 0; k < headers.length; k++) {
        var placeholder = '{{' + headers[k] + '}}';
        text = text.replace(placeholder, row[k]);
      }
      
      shape.getText().setText(text);
    }
  }
}

```

