# If go is installed
if command -v go &> /dev/null
then
  # Do some go work
  export PATH=$PATH:$(go env GOPATH)/bin
  export GOPATH=$(go env GOPATH)
fi
