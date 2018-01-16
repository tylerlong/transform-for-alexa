import S3 from 'aws-sdk/clients/s3'

const s3 = new S3()

export const transform = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))

  let records = event.Records // S3
  if (records === undefined) { // HTTP for testing purpose
    records = JSON.parse(event.body).Records
  }
  const record = records[0]
  s3.copyObject({
    CopySource: `/${record.s3.bucket.name}/${record.s3.object.key}`,
    Bucket: record.s3.bucket.name,
    Key: record.s3.object.key.replace('uploads/', 'transformed/')
  }, (error, data) => {
    console.log(error, data)
  })

  callback(null, { statusCode: 200, body: event.body, headers: event.headers })
}

/*
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "2018-01-16T09:40:13.586Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "A1CQ8CLYHH9IVW"
      },
      "requestParameters": {
        "sourceIPAddress": "103.215.2.181"
      },
      "responseElements": {
        "x-amz-request-id": "15E75098EF1114D6",
        "x-amz-id-2": "kyu4ij8+/2ox06hiw9UZQBsHqMmqpyZBlojJQuUdiyuAey5Jiu57TivfLDEItOC7IvOvMiVM1nc="
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "860f3d66-79fc-4368-998d-1a3a27936725",
        "bucket": {
          "name": "transform-for-alexa-audios",
          "ownerIdentity": {
            "principalId": "A1CQ8CLYHH9IVW"
          },
          "arn": "arn:aws:s3:::transform-for-alexa-audios"
        },
        "object": {
          "key": "uploads/all-choose-c.mp3",
          "size": 5801965,
          "eTag": "6425c20a346666daba693844bdbceab1",
          "sequencer": "005A5DC8649CD216F8"
        }
      }
    }
  ]
}
*/
