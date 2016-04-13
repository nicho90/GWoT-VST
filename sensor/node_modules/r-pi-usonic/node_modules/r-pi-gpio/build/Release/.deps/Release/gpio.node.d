cmd_Release/gpio.node := ln -f "Release/obj.target/gpio.node" "Release/gpio.node" 2>/dev/null || (rm -rf "Release/gpio.node" && cp -af "Release/obj.target/gpio.node" "Release/gpio.node")
