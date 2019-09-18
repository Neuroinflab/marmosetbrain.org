#/bin/bash
for i in *.scss; do sassc $i ${i%.*}.css; done
sassc fontawesome/font-awesome.scss font-awesome.css
