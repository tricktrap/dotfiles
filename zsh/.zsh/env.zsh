# Environment updates

# Wire up GPG
export GPG_TTY=$(tty)

# Just jenv things.
eval "$(jenv init -)"

# Incorporate local stuff that shouldn't be committed (e.g. git author config)
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
