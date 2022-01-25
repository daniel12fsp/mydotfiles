#!/usr/bin/env python3
#/home/infra/me/regolith-rofication/rofication-daemon

# 936 type = custom/script
# 937 exec = /home/infra/me/regolith-rofication/count_rofi_notification
# 938 format-prefix =   

import socket
import sys
server_address = '/tmp/rofi_notification_daemon'
sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
sock.connect(server_address)
sock.send(b'num\n')

response = sock.recv(1024)

print(response.decode().split(",")[0])