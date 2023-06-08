# geetest gobang captcha solver


1. 取得方塊排列資料
觀察 Gobang CAPTCHA 的 html 原始碼，第 a 行第 b 個的圓圈，div 中會含有 geetest_item-a-b 的 class。依序找出所有圓圈 div 的 background image，並以不同的 background image url 區分顏色。



2. 尋找五缺一之排列
在五個橫排、五個直排以及兩個斜排共十二個斜排中，尋找有四個相同顏色的一排。並紀錄該排相同的顏色以及空缺的點。

3. 尋找與排列相同顏色的圓圈
搜尋所有點，當某一點與上一步所記錄之顏色相同且不在上一部那排內，及找到點。


4. 點擊交換
點擊在 3. 時找到的點，而後在點擊 2. 時紀錄的點即完成破解。
