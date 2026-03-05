"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Mern",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Banner",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create Banner",
          url: "CreateBanner",
        },
        {
          title: "All Banner",
          url: "#",
        },
      ],
    },
    {
      title: "Category",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Category",
          url: "CreateCategory",
        },
        {
          title: "All Category",
          url: "#",
        },
      ],
    },
    {
      title: "Sub Category",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create subCategory",
          url: "CreateSubCategory",
        },
        {
          title: "All subCategory",
          url: "#",
        },
      ],
    },

    {
      title: "Brand",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Brand",
          url: "CreateBrand",
        },
        {
          title: "All Brand",
          url: "#",
        },
      ],
    },
    {
      title: "Discount",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Discount",
          url: "CreateDiscount",
        },
        {
          title: "All Discount",
          url: "#",
        },
      ],
    },
    {
      title: "Product",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Product",
          url: "CreateProduct",
        },
        {
          title: "All Product",
          url: "#",
        },
      ],
    },

    {
      title: "Variant",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Variant",
          url: "CreateVariant",
        },
        {
          title: "All Variant",
          url: "#",
        },
      ],
    },

    {
      title: "Coupon",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Coupon",
          url: "CreateCoupon",
        },
        {
          title: "All Coupon",
          url: "#",
        },
      ],
    },

    {
      title: "Warrenty",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Warrenty",
          url: "CreateWarrenty",
        },
        {
          title: "All Warrenty",
          url: "#",
        },
      ],
    },

    {
      title: "Shipinginfo",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Shipinginfo",
          url: "CreateShipinginfo",
        },
        {
          title: "All Shipinginfo",
          url: "#",
        },
      ],
    },

    {
      title: "Wearhouse",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Wearhouse",
          url: "CreateWearhouse",
        },
        {
          title: "All Wearhouse",
          url: "#",
        },
      ],
    },

    {
      title: "Cart",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Cart",
          url: "CreateCart",
        },
        {
          title: "All Cart",
          url: "#",
        },
      ],
    },

    {
      title: "Deliverycharge",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Deliverycharge",
          url: "CreateDeliverycharge",
        },
        {
          title: "All Deliverycharge",
          url: "#",
        },
      ],
    },

    {
      title: "Order",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Order",
          url: "CreateOrder",
        },
        {
          title: "All Order",
          url: "#",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
