
---
title: C计划
description: 把家里的非Type-c接口的设备都改成了Type-c的.
publishDate: 2023-05-07
language: 'zh-cn'
heroImage: { src: './1.png', color: '#D58388' }
tags:
  - Diy
---
## 前言：

现在Type-C接口已经成为了充电接口的主流，它有很多优点，比如支持正反插、充电快、插拔次数多等。但是我家里很多设备都不是Type-C接口的，比如键盘、剃须刀、体脂秤等，趁着有空，我打算把家里所有的非Type-C接口设备全都改成Type-c的。

前期准备：
----------------
1.想要正确的焊接，我们得知道type-c各个引脚的定义，下面是我在网上找到的资料：

 - 各个引脚的定义：

  ![](http://img.msx.ink/mmexport1703420752624.png)

 - pcb封装：
    ![](http://img.msx.ink/mmexport1703421616038.png)
    2.淘宝购买type-c母座，由于是用来改体重秤的接口，所以就用不到数据传输功能，为了方便焊接，所以我购买的是6pin的type-c母座

  ![](http://img.msx.ink/mmexport1703420748046.jpg)

开始改装：
----------------
以体重秤为例，首先把体重秤拆开
<img src="http://img.msx.ink/mmexport1703420769452.png" style="zoom:150%;" />
可以看到里面结构很简单，只有两根线，黄色线（GND）为负极，另外一根为正极；根据上面的资料可以看到，母座上的A9、B9引脚为VBUS（正极）A12、B12为GND(负极或接地)，也就是说母座上正极和负极引脚分别有两个，只需要把正负极焊接到其中的一对即可，下面开始焊接：
<img src="http://img.msx.ink/mmexport1703420677372.jpg" style="zoom:169%;" />

之前的接口是micro usb的，type-c接口比micro usb接口大，得用电磨机把接口磨大一点
<img src="http://img.msx.ink/mmexport1703420764537.png" style="zoom:123%;" />
打上热熔胶固定，再把外壳装回去，完事

<img src="http://img.msx.ink/mmexport1703420755233.png" style="zoom:110%;" />

一些改好的设备：

![剃须刀](http://img.msx.ink/mmexport1703420771071.png)

<img src="http://img.msx.ink/mmexport1703420756709.png" alt="理发推子" style="zoom:145%;" />