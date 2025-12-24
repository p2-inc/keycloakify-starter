import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-password.ftl" });

const meta = {
  title: "login/login-update-password.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default - Set New Password page
 * Users set a new password with validation requirements
 */
export const Default: Story = {
  render: () => <KcPageStory />
};

/**
 * With error message
 */
export const WithError: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "error",
          summary: "Password does not meet requirements."
        }
      }}
    />
  )
};

/**
 * App-initiated action (shows cancel button)
 */
export const AppInitiatedAction: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        isAppInitiatedAction: true
      }}
    />
  )
};

