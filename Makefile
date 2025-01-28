DOCKER_NAME = cr.yandex/crptg8lgsjvtjbk5oufk/warehouse-helper-nextjs
DOCKER_PLATFORM = --platform linux/amd64

docker-build:
	docker build . $(DOCKER_PLATFORM) -t $(DOCKER_NAME):$(TAG)

docker-push:
	docker push $(DOCKER_PLATFORM) $(DOCKER_NAME):$(TAG)
	