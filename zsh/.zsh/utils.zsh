function whenis {
  date -j -f %s $1
}

function ch() {
  local cols sep google_history open
  cols=$(( COLUMNS / 3 ))
  sep='{::}'

  if [ -d "$HOME/Library/Application Support/Google/Chrome/Default" ]; then
    google_history="$HOME/Library/Application Support/Google/Chrome/Default/History"
  else
    google_history="$HOME/Library/Application Support/Google/Chrome/Profile 1/History"
  fi
  open=open
  
  cp -f "$google_history" /tmp/h
  sqlite3 -separator $sep /tmp/h \
    "select substr(title, 1, $cols), url
     from urls order by last_visit_time desc" |
  awk -F $sep '{printf "%-'$cols's  \x1b[36m%s\x1b[m\n", $1, $2}' |
  fzf --ansi --multi | sed 's#.*\(https*://\)#\1#' | xargs $open > /dev/null 2> /dev/null
}