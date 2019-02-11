CC=g++
CFLAGS=`mysql_config --cflags` -std=c++11 -I/usr/local/include/ -c
LDFLAGS=`mysql_config --libs` -std=c++11 -lpigpio

all: heatmap_backend

heatmap_backend: Session.o main.o
	$(CC) $(LDFLAGS) Session.o main.o -o heatmap_backend
	
Session.o: Session.cpp
	$(CC) $(CFLAGS) Session.cpp

main.o: main.cpp
	$(CC) $(CFLAGS) main.cpp


clean:
	rm *o test