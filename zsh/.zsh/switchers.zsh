# Test and initialize commands that switch out runtimes

if command -v jenv &> /dev/null
then
  # Just jenv things.
  eval "$(jenv init -)"
fi

if command -v nodenv &> /dev/null
then
  # Initialize nodenv
  eval "$(nodenv init -)"
fi

if command -v rvm &> /dev/null
then
  # Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
  export PATH="$PATH:$HOME/.rvm/bin"
fi
