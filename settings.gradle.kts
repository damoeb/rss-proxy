rootProject.name = "rss-proxy"

include("packages:playground")

buildscript {
  repositories {
    gradlePluginPortal()
  }
//  dependencies {
//    val gradleNodePluginVersion = "3.1.0"
//    classpath ("com.github.node-gradle:gradle-node-plugin:$gradleNodePluginVersion")
//  }
}
