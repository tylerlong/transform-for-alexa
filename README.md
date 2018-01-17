# transform-for-alexa

Transform audio files so they could be feed into Amazon Alexa.


## Usage

Before you deploy this app to AWS Lambda, configure a S3 bucket name in `audios/env.yml` file.

After deployment, create two folders in the S3 bucket: `input` & `output`.

Whenever you upload an mp3 file to `input` folder, this app will transform the mp3 file and save the result into `output` folder.


## Setup

```
yarn install

cd audios
cp env.sample.yml env.yml
edit env.yml
```

Download the [static build of ffmpeg](https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-64bit-static.tar.xz). Extract it and save the `ffmpeg` binary into `audios/` folder.


## Deploy

### Full deploy

    yarn deploy:full

### Quick deploy

    yarn deploy

### Deploy to production

    yarn deploy:full:prod


## Service information

    yarn run info


## Log information

    yarn run log

Or check log in realtime:

    yarn run log:stream


## Remove the service

    yarn run remove
