# Environment updates

# Wire up GPG
export GPG_TTY=$(tty)

# Incorporate local stuff that shouldn't be committed (e.g. git author config)
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;

# Add local bin
export PATH="$PATH:$HOME/bin"

export SPARK_LOCAL_IP="127.0.0.1"
