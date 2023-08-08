d-build:## build docker image
d-build:
	docker build -t mmroshani/mongo-cdc:0.0.1 .

d-run:## run docker image
d-run:
	docker run --env-file .env -it -p 3030:3030 mmroshani/mongo-cdc:0.0.1

d-pub:## publish docker image
d-pub:
	docker push mmroshani/mongo-cdc:0.0.1