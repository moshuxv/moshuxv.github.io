
---
title: Cisco路由学习笔记
description: 学习Cisco路由记的一些笔记.
publishDate: 2020-01-27
tags:
  - 学习
  - 笔记
language: 'zh-cn'
heroImage: { src: './thumbnail.jpg', color: '#D58388' }
---

##  OSI/TCP分层

##   1、OSI

  

  1层：物理层：双绞线、集线器、转换器、中继器、

  2层：链路层：网卡(mac地址)、交换机、网桥、

  3层：网络层：路由器、IP地址、

  4层：传输层：tcp&udp、专门为应用层服务。

  5层：会话层

  6层：表示层

  7层：应用层：为软件提供的接口（端口）https(443)、dns.....

###   2、TCP

  1层：网络接口层：对应osi物理层&链路层.

  2层：网络互联层：对应osi网络层.

  3层：传输层:对应osi传输层.

  4层：应用层:对应osi会话层、表示层、应用层、



##   TCP&UDP

###   1.TCP（传输控制协议)

  面向连接、可靠传输、流控及窗口机制、

  应用：浏览器、文件传输、Email、

###   2.UDP：(用户数据报协议)

  无连接、不可靠传输、尽力而为传输、

  应用：视频流、DNS、IP语音、



##   IP

##   1、分类

  A:1-126 255.0.0.0/8

  B:128-191 255.255.0.0/16

  C:192-223 255.255.255.0/24

  D:224-239（组播地址）

  E:240-255（科研保留）

##   2、私网地址

   A：10.0.0.0-10.255.255.255

  B:172.16.0.0-172.31.255.255.255

  C:192.168.0.0-192.168.255.255

##   3、特殊

  

  127:环回IP地址，分配给操作系统

  0.0.0.0:代表所有地址

  255.255.255.255：全网广播地址

###   4、组成：

  网络位：代表当前网段主机所在的组织

  主机位：代表当前网段内可用于主机的IP

###   5、区分网络位与主机位：

  通过子网掩码，将IP＆子网掩码进行与运算，计算结果不变的为网络位，归零为主机位。

###  6、 子网划分

####   1.VLSM

  通过将主类掩码延长，来达到减少主机位，增加子网数的目的。

####   2.常用数字：

  2^0=1; 2^1=2; 2^2=4; 2^3=8; 2^4=16; 2^5=32; 2^6=64; 2^7=128;

####   3.用法：

  确认主机地址数量并匹配合适地址区间

  用256减去匹配到的地址区间得出掩码

  确认网络地址、广播地址、可用主机范围、



##   双绞线

###   1、T-568A线序:

  绿白——绿——橙白——蓝——蓝白——橙——棕白——棕

###   2、T-568B线序:

  橙白——橙——绿白——蓝——蓝白——绿——棕白——棕

##   路由

###   1、协议

  距离矢量协议：传递路由表（路由不知道网络拓扑，只知道找传递路由表给自己的路由）。

  链路状态协议：传递数据库。（每台路由都知道网络拓扑）

###   2、接口

  ethernet（以太网口）、fastEthernet（快速以太网）、serial（串行链路口）

###   3、路由表

  C:直连网段路由； S：静态路由； S*:默认路由； I：igrp; O:OSPF

###   4、管理距离越小路由优先级越高

  

###   路由配置常用命令

####   1、模式

  

```
  router>        //普通模式

  router#        //特权模式,在普通模式输入：enable进入

  router(config)#      //全局模式，在特权模式输入：config terminal进入

  Router(config-if)#    //端口模式， 在特权模式输入interface +端口号 进入

  Router(config-line)#    //线路模式，在全局模式输入命令：line console 0 进入

  Router(config-router)#   //路由引擎模式，在全局模式输入命令：router rip进入
```



####   2、show

  

```
  router#show  running-config    //显示正在运行的配置

  Router#show ip interface  brief //显示路由接口配置

  router#show ip route       //查看路由表
```



####   3、工程三招

  

```
  router(config)#no ip domain -lookup   //禁用dns解析

  router(config)#ip domain -lookup    //开启dns解析

  Router(config)#line console 0

  Router(config-line)#logging synchronous //log当前显示信息同步

  Router(config-line)#no exec-timeout   //设置永不超时
```



####   4、简单配置

  

  

```
命令首字母+？  //查询命令

  命令前面+no  //删除命令

  router(config)#enable password *** //设置进入特权模式的密码

  router(config)#enable secret *** //设置进入特权模式的密码（加密）

  router(config)#hostname **     //重命名router(config)

  router(config)#interface s0/0      //进入端口s0/0 

  router(config)#intface loopback ？  //创建环回接口

  router(config-if)#ip address IP 子网掩码  //配置IP和子网掩码

  router(config-if)#no shutdown  //启动端口

  router#exit   //退出到上一级
```



####   静态路由

  1、静态路由配置命令：

  

```
R1(config)#ip route 目的IP 子网掩码 下一跳地址
```

  2、静态默认路由：

```
  R1(config)#ip route 0.0.0.0 0.0.0.0 下一跳地址
```

####   Rip

  1、广播：一对所有，组播：一对多，单播：一对一。

  2、Rip

  度量值：跳数（超过15跳不可达）。

  RIP v1有类路由，RIP v2无类路由，（有类路由：不传子网掩码，无类路由：传递子网掩码）。

  使用UDP传输

  源目的端口号为520

  RIP协议号为17

  消息形式：请求消息，响应消息。

  默认支持等价负载均衡：4，最大6.

  管理距离120

  3、Rip计时器

  更新计时器（update）：30s更新路由表。

  无效计时器（invalid）:180s不刷新则将该路由条目的度量值设置为16。

  刷新计时器（flush）：默认240s，比无效计时器长60s。刷新后路由条目则删除。

  抑制计时器（hold-down）：180s。

  4、Rip防环机制：

  水平分割，路由毒化，触发更新。

  5、配置命令：

```
  Router(config)#router rip        //启动Rip进程

  Router(config-router)#version 2     //定义为版本2

  Router(config-router)#no auto-summary  //关闭自动汇总

  Router(config-router)#network network-number   //哪些网络参与路由
```

####   OSPF

  1、OSPF V2

  链路状态协议、

  度量值cost=10^8/接口带宽

  使用hello包简历邻居，10s里哟个组播发送一次，组播地址224.0.0.5

  管理距离110

  无自动汇总

  协议号：89

  2、五个数据包

  Hello数据包，功能:用于邻居的发现、建立与保活（10s维持邻居，40s超时）

  DBD数据包，功能：描述数据库的目录信息

  LSR数据包，功能：请求在DBD交换过程中发现的本路由器中没有的或已过时的LSA包细节（请求）

  LSU数据包，功能：用于LSA的洪泛和响应LSR（更新）

  LSAck数据包，功能：对LSU的确认（更新后回复确认）

  3、配置命令  

```
  R3(config)#router ospf 1  //启动ospf进程，本地进程号为1 

  R1(config-router)#router-id * //配置routerid（可选）

  R3(config-router)#network 23.1.1.2 0.0.0.255 area 0  //宣告网段；反掩码；宣告进的区域。


```

  4、查看ospf建立的邻居关系

```
R1#show ip ospf neighbor 
```

####   Eigrp

  1、三张表

  IP路由表：从EIGRP拓扑表以及其他路由协议进程（如RIP、OSPF等）选出的所有最优路由的列表

  拓扑表：从每个EIGRP邻居学习的所有路由的列表

  邻居表：与本路由器建立EIGRP邻居关系的直连路由器的列表

  2、管理距离

  内部：90

  外部：170

  汇总：5

  3、Eigrp

  组播地址：224.0.0.10

  协议号：88

  高级距离矢量协议

  4、配置  

```
  Router(config)#router eigrp 200
  Router(config-router)#network
  Router(config-router)#no auto-summaryxxxxxxxxxx Router(config)#router eigrp   Router(config-router)#networkRouter(config-router)#no auto-summary
```

