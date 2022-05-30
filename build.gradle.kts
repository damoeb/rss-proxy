buildscript {
  repositories {
    gradlePluginPortal()
  }
  dependencies {
    classpath ("com.github.node-gradle:gradle-node-plugin:${findProperty("gradleNodePluginVersion")}")
  }
}

tasks.register("buildDockerImage", Exec::class) {
//  dependsOn(tasks.findByPath("packages:playground:build"))
  val majorMinorPatch = findProperty("proxyVersion") as String
  val parts = majorMinorPatch.split(".")
  val major = parts[0]
  val majorMinor = parts.slice(0..1).joinToString(".")

  val imageName = findProperty("dockerImageTag") as String
  println("imageName")
  println("${imageName}:${majorMinor}")


  commandLine("docker", "build",
    "-t", "${imageName}:${majorMinorPatch}",
    "-t", "${imageName}:${majorMinor}",
    "-t", "${imageName}:${major}",
    "-t", imageName,
    ".")
}
