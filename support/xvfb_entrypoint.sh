#!/bin/sh

export DISPLAY=:99.0

Xvfb :99 -screen 0 640x480x8 -nolisten tcp &

exec "$@"