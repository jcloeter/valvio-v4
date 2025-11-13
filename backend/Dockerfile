FROM maven:4.0.0-rc-4-amazoncorretto-17-al2023 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM amazoncorretto:17
COPY --from=build /app/target/valvio-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
RUN java -jar valvio-0.0.1-SNAPSHOT.jar

CMD ["/bin/bash"]

#Start here: get your database url connection to work in the container. 