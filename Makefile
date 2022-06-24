test: install
	cd packages/playground && yarn testCi

install:
	cd packages/playground && yarn --frozen-lockfile -s
