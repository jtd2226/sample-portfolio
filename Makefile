run: 
	npm start

deploy: 
	npm run build
	npm run deploy

revert:
	git checkout -- .