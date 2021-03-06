#!/usr/bin/env python

# #!c:\Python25\python.exe
"""
An echo client that allows the user to send multiple lines to the server.
Entering a blank line will exit the client.
"""
import select
import socket
import sys

host = '127.0.0.1'
port = 50001
size = 1024

#connect to server
s_conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s_conn.connect((host, port))

#setup the input list: socket and keyboard
input = [s_conn, sys.stdin]

# #read the hello message from the server:
# data = s.recv(size)
# sys.stdout.write("--> ")    
# sys.stdout.write(data)
# sys.stdout.write('\n% ')
running = 1
while running:
    inputready, outputready, exceptready = select.select(input, [], [])
    for s in inputready:
        if s == s_conn:
            sys.stdout.write('# ')
            # read the socket:
            data = s_conn.recv(size)
            sys.stdout.write("<-- ")
            sys.stdout.write(data)
            sys.stdout.write('% ')
            #sys.stdout.print ("dumi")
        if s == sys.stdin:
            sys.stdout.write('# ')
            #read from keyboard
            line = sys.stdin.readline()
            sys.stdout.write("--> ")
            sys.stdout.write(line)
            if line.rstrip('\n') == "quit":
                print ("umm... I think we should quit now")
                running = 0
            s_conn.send(line)
            #    sys.stdout.write('# we just sent: ')
            sys.stdout.write('% ')
s.close()
