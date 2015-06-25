jsizes(++)

====

一款通过锚点改变矩形大小和角度的组件

## 基本信息

### 锚点

```
     r
(x,y)|
 nw--n--ne(x + w, y)
  |  |  |
  w--c--e (x + w, y + h / 2)
  |  |  |
 sw--s--se(x + w, y + h)
```

name|full name |desc
----|----------|----
n   |north     |
s   |south     |
w   |west      |
e   |east      |
nw  |north west|
ne  |north east|
sw  |south west|
se  |south east|
c   |center    |中心点
r   |rotate    |旋转点
