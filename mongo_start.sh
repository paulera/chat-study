#!/bin/bash
mongod --bind_ip=$IP --dbpath=/home/ubuntu/workspace/data --nojournal --rest "$@"
