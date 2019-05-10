# This is an experimentation repository. I am trying aws amplify on a new cra
## Here are some observation that I made

- The role of amplify here is to make the integration of frontend and backend seamless. I the backend with SAM, then connect it manually by pointing buttons to it's appropriate endpoint. With amplify, everything is integrated
- This is interesting, on the lambda function, you can actually use axios to "get external data." This means I can overcome the bottleneck of not having python lambda code by calling the "python lambda" from the javascript using axios. That's fucking cool.