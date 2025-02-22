# scheduleaway

Prerequisites:

- [NodeJS](https://nodejs.org/en) Latest LTS version
- [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/) Latest version 
- (optional) [Bun](https://bun.sh) package manager

To install dependencies:

```bash
npm run init
# or you can use bun if you prefer it
npm run init:bun
```

For clean install use:

```bash 
npm run clean-install
# or
npm run clean-install:bun
```

To build 

```bash
npm run build
# or 
npm run build:bun
```


To run:

```bash
npm run start
# or 
npm run start:bun
```

If MongoDB is not running, start it with:

```bash
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

Run this command to see which process is using port 5000:

On macOS/Linux:
```bash
lsof -i :5000
```
Then, kill the process using:
```bash
kill -9 <PID>
```
Replace <PID> with the process ID from the lsof output.

On Windows:
```bash
netstat -ano | findstr :5000
```

Then, kill the process with:
```bash
taskkill /PID <PID> /F
```