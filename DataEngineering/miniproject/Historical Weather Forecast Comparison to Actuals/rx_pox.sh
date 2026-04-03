#! /bin/bash
city=Casablanca
obs_temp=$(curl -s wttr.in/$city?T| grep -m 1 '°.' | grep -Eo -e '-?[[:digit:]].*'| grep -Eo -e '-?[0-9]+'| head -1)
fc_temp=$(curl -s wttr.in/$city?T | head -23 | tail -1 |  cut -d 'C' -f2 | grep -Eo -e '-?[[:digit:]].*'| grep -Eo -e '-?[0-9]+'| head -1)
echo "Current tempreture : $obs_temp C"
echo "Forcasted tempreture: $fc_temp C"
year=$(date +"%Y")
month=$(date +"%m")
day=$(date +"%d")
$(echo -e "$year\t$month\t$day\t$obs_temp\t$fc_temp" >> rx_poc.log) 
