package com.detoxdemoapp

import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule

@RunWith(AndroidJUnit4::class)
class DetoxTest {
    // Kotlin yêu cầu dùng @get:Rule cho các biến Rule public
    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Test
    fun runDetoxTests() {
        val detoxConfig = DetoxConfig()
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60
        
        // Trong Kotlin, truy cập BuildConfig đơn giản hơn
        if (BuildConfig.DEBUG) {
            detoxConfig.rnContextLoadTimeoutSec = 180
        } else {
            detoxConfig.rnContextLoadTimeoutSec = 60
        }

        Detox.runTests(activityRule, detoxConfig)
    }
}