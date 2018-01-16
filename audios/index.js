import S3 from 'aws-sdk/clients/s3'
import uuidv1 from 'uuid/v1'
import fs from 'fs'
import childProcess from 'child_process'

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

const s3 = new S3()

export const transform = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))

  let records = event.Records // S3
  if (records === undefined) { // HTTP for testing purpose
    records = JSON.parse(event.body).Records
  }
  const record = records[0]
  const bucket = record.s3.bucket.name
  const sourceKey = record.s3.object.key
  const targetKey = sourceKey.replace('uploads/', 'transformed/')
  const tempFile = `/tmp/${uuidv1()}.mp3`
  const tempFile2 = `/tmp/${uuidv1()}.mp3`

  s3.getObject({ Bucket: bucket, Key: sourceKey }, (error, data) => {
    console.log(error, data)
    const body = data.Body
    fs.writeFileSync(tempFile, body)
    const process = childProcess.spawn('ffmpeg', [
      '-y', '-i', tempFile, '-ar',
      '16000', '-ab', '48k', '-codec:a',
      'libmp3lame', '-ac', '1', tempFile2])
    process.stderr.on('data', data => {
      const message = data.toString()
      console.log(message)
    })
    process.on('close', (code, signal) => {
      console.log(code, signal)
      const fileContent = fs.readFileSync(tempFile2)
      s3.putObject({ Body: fileContent, Bucket: bucket, Key: targetKey }, (error, data) => {
        console.log(error, data)
        fs.unlinkSync(tempFile)
      })
    })
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
          "key": "uploads/4933.mp3",
          "size": 5801965,
          "eTag": "6425c20a346666daba693844bdbceab1",
          "sequencer": "005A5DC8649CD216F8"
        }
      }
    }
  ]
}
*/
