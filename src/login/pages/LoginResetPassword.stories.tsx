import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
  title: "login/login-reset-password.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default - Find Your Account page
 * Allows users to choose between Email or Phone Number for verification code delivery
 */
export const Default: Story = {
  render: () => <KcPageStory />
};

/**
 * With info message
 */
export const WithInfoMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "info",
          summary: "Please verify your identity to reset your password."
        }
      }}
    />
  )
};

