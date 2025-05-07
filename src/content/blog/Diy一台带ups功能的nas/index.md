
---
title: Diy一台带Ups功能的Nas
publishDate: 2023-04-18
description: '组了一台nas.'
tags:
  - Diy

language: 'zh-cn'
heroImage: { src: './1.jpg', color: '#D58388' }
---


## 前言

​	由于存放在网盘的文件经常被和谐，所以产生了组一台NAS的想法，方便存储文件，当个人网站服务器用。

![](http://img.msx.ink/mmexport1703416360445.jpg)

## 一、确定需求

###### 基本需求

- 能运行虚拟机
- 具有一定的硬件解码能力
- 低功耗。

###### Ups功能

​	ups的的主要作用是防止突然间停电影响nas的工作导致硬盘损坏，为了nas的数据安全，一台ups肯定是必不可少的，目前市面上的ups基本上都是交流电UPS，缺点有很多，体积大、空载的功耗高转化率低,市面上又基本上找不到适合nas用的大功率直流UPS，所以我打算自己DIY。

###### 电量统计功能

​	nas是365天不间断运行的，对于它的耗电量，我心里也是充满了好奇。所以我觉得有必要加上电量统计功能，方便知道用了多少电。

## 二、方案制定

##### 基本功能

- nas的主要硬件方面我选择了映泰j4125+8G内存的组合，加一根16G的傲腾ssd做缓存，J4125在黑群晖920+下可以免打驱动使用核显，功耗TPD10W。

-  因为Nas还要实现ups功能，所以机箱除了要塞下基本硬件外，还要塞下ups的电池组，所以机箱的内部空间必须得大，在我的精挑细选下，最终选择了这款机箱：

  ![](http://img.msx.ink/mmexport1703417129065.jpg)

因为这款机箱的配色我不太喜欢，所以我对机箱重新进行了喷漆

![](http://img.msx.ink/mmexport1703417275972.jpg)

喷完漆后的效果:

![](http://img.msx.ink/mmexport1703417401347.jpg)

##### ups功能

###### ups模块

​	市面上基本上找不到大功率直流ups模块,逛淘宝的时候只找到了一款给路由器用的Ups模块，最大功率支持12V 4A

![](http://img.msx.ink/mmexport1703417513487.png)

但是12X4＝48w 功率还是不够高怎么办？
那就把两块ups模块并联起来呗，并联之后功率叠加 12*8=96w

###### 电池组

​	 电池在这里的作用是储存电能，当停电的时候由电池给nas供电，在这里我用了3颗21700电池进行串联，单颗电池容量18.5wh 18.5*3=55.5，也就是说能够支持55.5w的电器使用一个小时，由于没有点焊机，所以我自己用亚克力板做了一个电池盒，将电池串联起来。

<img src="http://img.msx.ink/mmexport1703417774783.jpg" style="zoom:150%;" />

<img src="http://img.msx.ink/mmexport1703417789896.jpg" style="zoom:33%;" />

###### 电源

  想要低功那就只能选择DC-ATX方案，市面上的dc电源质量参差不齐，在多多比较后我选择了微软xbox电源。

![](http://img.msx.ink/mmexport1703418073406.jpg)

###### 电量统计

​	由于技术不够，不会设计电路，在电量统计功能方面，我用智能插座来统计电量，选用了小米智能插座3。



## 三、组装环节

把智能插座和电源的外壳拆除后，把所有的元器件焊接在一起。

![](http://img.msx.ink/mmexport1703418529291.jpg)

![](http://img.msx.ink/mmexport1703418535703.jpg)

方框里的元器件分别是：
①拆除了外壳的小米智能插座3
②风扇调速模块；电源在运行的时候温度是很烫的，所以我加装了一个风扇给电源降温，模块带温控功能，能根据机箱环境温度进行调节转速速或者停止工作。
③拆除了外壳的xbox电源。
④两块并联的UPS模块。
⑤电池组

接线图：

![](http://img.msx.ink/mmexport1703419110533.png)

最终效果：

![](http://img.msx.ink/mmexport1703417401347.jpg)

支持电量信息统计：

![](http://img.msx.ink/mmexport1703419206636.jpg)

###### 停电后自动关机功能

​	ups理论上能支持nas使用一个小时左右，但是万一停电时间比较长，ups的电量也会有耗尽的时候，怎么才能让nas在停电的时候自动关机呢？

​	我的思路是写一个脚本，每隔2分钟ping一下路由器，如果停电了路由器是不会回应的，如果路由器没有回应，就执行关机命令，具体做法如下：

1. 首先ssh 连接nas，在/mnt目录下创建一个名为autoshutdown.sh的文件，并设置文件的权限为755:

```
mkdir autoshutdown.sh /mnt
chmod -r 755 /mnt/autoshutdown.sh
```

   2.用vi编辑器编辑autoshutdown.sh，在文件里输入下面的脚本：

```bash
#!/bin/sh
MonitorIP=192.168.1.1
DelayTime=120s
ping -c 1 $MonitorIP > /dev/null
ret=$?
if [ $ret -eq 0 ]
then
echo ‘ AC Power OK ! ‘
else
synologset1 sys warn 0x11600036
echo ‘ AC Power maybe off, checking again after 1 minutes ! ‘
sleep $DelayTime
ping -c 1 $MonitorIP > /dev/null
ret=$?
if [ $ret -eq 0 ]
then
synologset1 sys warn 0x11600037
echo ‘ Checkagain, AC Power OK ! ‘
else
synologset1 sys warn 0x11600035
poweroff
fi
fi
```

   3.设置定时运行，用vi修改/etc/目录下的系统定时文件crontab，添加如下内容后重启nas

```
root        /mnt/autoshutdown.sh

```

