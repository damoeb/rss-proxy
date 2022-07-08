buildscript {
  repositories {
    gradlePluginPortal()
  }
  dependencies {
    classpath ("com.github.node-gradle:gradle-node-plugin:${findProperty("gradleNodePluginVersion")}")
  }
}

plugins {
  id("org.ajoberstar.grgit") version "4.1.0"
}

tasks.register("buildDockerImage", Exec::class) {
  dependsOn(tasks.findByPath("packages:playground:build"))
  val majorMinorPatch = findProperty("proxyVersion") as String
  val parts = majorMinorPatch.split(".")
  val major = parts[0]
  val majorMinor = parts.slice(0..1).joinToString(".")

  val imageName = findProperty("dockerImageTag") as String
  val gitHash = grgit.head().abbreviatedId

  // see https://github.com/docker-library/official-images#multiple-architectures
  // install plarforms https://stackoverflow.com/a/60667468/807017
  // docker buildx ls
//  commandLine("docker", "buildx", "build",
  commandLine("docker", "build",
    "--build-arg", "PROXY_VERSION=${majorMinorPatch}-${gitHash}",
//    "--platform=linux/amd64",
//    "--platform=arm64v8",
    "-t", "${imageName}:${majorMinorPatch}",
    "-t", "${imageName}:${majorMinor}",
    "-t", "${imageName}:${major}",
    "-t", imageName,
    ".")
}
