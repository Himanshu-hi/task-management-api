PS D:\TaskAPI\backend> FROM maven:3.9.4-eclipse-temurin-17 AS build
>> WORKDIR /app
>> COPY pom.xml .
>> COPY src ./src
>> RUN mvn clean install -DskipTests
>> 
>> FROM eclipse-temurin:17-jre
>> WORKDIR /app
>> COPY --from=build /app/target/*.jar app.jar
>> EXPOSE 8080
>> ENTRYPOINT ["java", "-jar", "app.jar"]
At line:1 char:1
+ FROM maven:3.9.4-eclipse-temurin-17 AS build
+ ~~~~
The 'from' keyword is not supported in this version of the language.
At line:7 char:1
+ FROM eclipse-temurin:17-jre
+ ~~~~
The 'from' keyword is not supported in this version of the language.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : ReservedKeywordNotAllowed
 