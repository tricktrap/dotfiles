# Environment updates

# Just jenv things.
eval "$(jenv init -)"

# Incorporate local stuff that shouldn't be committed (e.g. git author config)
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
