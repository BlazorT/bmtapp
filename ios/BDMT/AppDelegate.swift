import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import GoogleMaps
import FBSDKCoreKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // Firebase
    FirebaseApp.configure()

    // Google Maps
    GMSServices.provideAPIKey("AIzaSyDxx5ENjExVPPlj-EfTnL8eLFQMj8kOXCo")

    // Facebook SDK (CORRECT)
    ApplicationDelegate.shared.initializeSDK()

    // React Native
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "BDMT",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // Facebook Login / Deep Links
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {

    return ApplicationDelegate.shared.application(
      app,
      open: url,
      options: options
    )
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings()
      .jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
