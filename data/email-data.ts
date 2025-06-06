import type { Email, EmailCategory, SidebarItem, FolderItem } from "@/types/email"
import { Mail, Calendar, CheckSquare, BarChart3, Inbox, Send, Star, Archive, Trash2 } from "lucide-react"

export const emailCategories: EmailCategory[] = [
  { name: "All", count: 8, color: "bg-slate-500" },
  { name: "Work", count: 3, color: "bg-blue-500" },
  { name: "Personal", count: 2, color: "bg-purple-500" },
  { name: "Marketing", count: 1, color: "bg-yellow-500" },
  { name: "Social", count: 1, color: "bg-red-500" },
  { name: "Urgent", count: 1, color: "bg-orange-500" },
]

export const emails: Email[] = [
  {
    id: 1,
    sender: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Project Timeline Update - Important Changes",
    preview:
      "I've reviewed the latest project timeline and there are some critical adjustments we need to discuss. The new deadline for phase 1 has been moved up by two weeks, which means we'll need to reallocate resources and possibly bring in additional team members to meet the requirements.",
    time: "09:45 AM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: true,
    isStarred: true,
    isRead: false,
    priority: "high",
    fullContent: `Hi Team,

I've reviewed the latest project timeline and there are some critical adjustments we need to discuss. The new deadline for phase 1 has been moved up by two weeks, which means we'll need to reallocate resources and possibly bring in additional team members to meet the requirements.

Here are the key changes:

1. **Phase 1 Deadline**: Moved from June 15th to June 1st
2. **Resource Allocation**: We need 2 additional developers
3. **Budget Impact**: Estimated 15% increase in project costs
4. **Risk Assessment**: Medium to high risk of delays if we don't act quickly

I've attached the updated project timeline and resource allocation spreadsheet for your review. Please let me know your thoughts and availability for a team meeting this week.

Best regards,
Sarah Johnson
Project Manager`,
    timestamp: "May 28, 2025 at 9:45 AM",
    recipients: [
      { email: "team@company.com", name: "Development Team", type: "to" },
      { email: "manager@company.com", name: "Project Manager", type: "cc" },
    ],
    attachments: [
      { id: "1", name: "Project_Timeline_Updated.xlsx", size: "2.4 MB", type: "spreadsheet" },
      { id: "2", name: "Resource_Allocation.pdf", size: "1.8 MB", type: "pdf" },
    ],
    labels: ["Important", "Project", "Deadline"],
  },
  {
    id: 2,
    sender: "Marketing Team",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "New Product Launch: Exciting Announcement",
    preview:
      "We're thrilled to announce our newest product launch happening next week. This revolutionary tool will change how teams collaborate and communicate. We've prepared a comprehensive marketing campaign that includes social media, email marketing, and influencer partnerships.",
    time: "11:20 AM",
    category: "Marketing",
    categoryColor: "bg-yellow-500",
    hasAttachments: true,
    isStarred: false,
    isRead: false,
    priority: "medium",
    fullContent: `Dear Team,

We're thrilled to announce our newest product launch happening next week! This revolutionary tool will change how teams collaborate and communicate across different time zones and departments.

**Product Highlights:**
- Real-time collaboration features
- AI-powered insights and analytics
- Seamless integration with existing tools
- Enhanced security and privacy controls

**Marketing Campaign Overview:**
We've prepared a comprehensive marketing campaign that includes:
- Social media campaigns across all platforms
- Email marketing to our subscriber base
- Influencer partnerships and collaborations
- Press releases and media outreach

The launch event is scheduled for June 5th at 2:00 PM PST. We expect significant media coverage and customer interest.

Please review the attached marketing materials and let us know if you have any questions or suggestions.

Best regards,
Marketing Team`,
    timestamp: "May 28, 2025 at 11:20 AM",
    recipients: [{ email: "all@company.com", name: "All Staff", type: "to" }],
    attachments: [
      { id: "3", name: "Marketing_Campaign_Overview.pdf", size: "3.2 MB", type: "pdf" },
      { id: "4", name: "Product_Launch_Assets.zip", size: "15.7 MB", type: "archive" },
    ],
    labels: ["Marketing", "Product Launch", "Announcement"],
  },
  {
    id: 3,
    sender: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Disappointed with Recent Service Quality",
    preview:
      "I wanted to express my concerns regarding the quality of service we've received over the past month. There have been several instances where our expectations weren't met, and I believe we need to have a conversation about how to improve moving forward.",
    time: "4:33 PM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: false,
    isStarred: true,
    isRead: false,
    priority: "high",
    fullContent: `Dear Support Team,

I wanted to express my concerns regarding the quality of service we've received over the past month. There have been several instances where our expectations weren't met, and I believe we need to have a conversation about how to improve moving forward.

**Specific Issues:**
1. Response times have increased significantly (average 48+ hours)
2. Technical issues remain unresolved for extended periods
3. Communication gaps between different support team members
4. Lack of proactive updates on ongoing issues

**Impact on Our Business:**
- Delayed project deliveries
- Frustrated team members
- Potential client dissatisfaction
- Increased operational costs

I would appreciate the opportunity to discuss these concerns and work together on a solution. Please let me know when we can schedule a call to address these issues.

Looking forward to your response.

Best regards,
James Wilson
Operations Director`,
    timestamp: "May 28, 2025 at 4:33 PM",
    recipients: [
      { email: "support@company.com", name: "Support Team", type: "to" },
      { email: "manager@company.com", name: "Support Manager", type: "cc" },
    ],
    labels: ["Customer Feedback", "Service Quality", "High Priority"],
  },
  {
    id: 4,
    sender: "LinkedIn",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "You have 5 new connection requests",
    preview:
      "You have 5 new connection requests waiting for your response. These connections could help expand your professional network and open up new opportunities for collaboration and career growth.",
    time: "10:15 AM",
    category: "Social",
    categoryColor: "bg-red-500",
    hasAttachments: false,
    isStarred: false,
    isRead: true,
    priority: "low",
    fullContent: `Hi there,

You have 5 new connection requests waiting for your response. These connections could help expand your professional network and open up new opportunities for collaboration and career growth.

**New Connection Requests:**
1. Sarah Chen - Product Manager at TechCorp
2. Michael Rodriguez - Software Engineer at StartupXYZ
3. Emily Davis - Marketing Director at GrowthCo
4. David Kim - Data Scientist at AnalyticsPro
5. Lisa Thompson - UX Designer at DesignStudio

Connecting with professionals in your industry can lead to:
- New job opportunities
- Collaborative projects
- Industry insights and trends
- Mentorship opportunities
- Business partnerships

Click the link below to review and respond to these connection requests.

Best regards,
The LinkedIn Team`,
    timestamp: "May 28, 2025 at 10:15 AM",
    recipients: [{ email: "user@email.com", name: "You", type: "to" }],
    labels: ["Social", "Networking", "LinkedIn"],
  },
  {
    id: 5,
    sender: "Mom",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Family Dinner This Weekend",
    preview:
      "Hope you're doing well! We're planning a family dinner this Saturday at 6 PM. Your dad is making his famous lasagna, and your sister will be bringing dessert. We'd love to catch up and hear about your new job.",
    time: "7:22 PM",
    category: "Personal",
    categoryColor: "bg-purple-500",
    hasAttachments: false,
    isStarred: true,
    isRead: true,
    priority: "medium",
    fullContent: `Hi Sweetheart,

Hope you're doing well! We're planning a family dinner this Saturday at 6 PM. Your dad is making his famous lasagna (the one with the secret ingredient he still won't tell us about!), and your sister will be bringing dessert.

We'd love to catch up and hear about your new job. Dad has been bragging to all the neighbors about how proud he is of you, and I can't wait to hear all the details myself.

**Dinner Details:**
- Date: Saturday, June 1st
- Time: 6:00 PM
- Menu: Dad's famous lasagna, garlic bread, Caesar salad
- Dessert: Sarah's bringing her chocolate cake (your favorite!)

Please let me know if you can make it so I can set the table accordingly. If you have any dietary restrictions or preferences, just let me know and we'll make sure to accommodate.

Looking forward to seeing you!

Love,
Mom

P.S. - Don't forget to bring that photo album you mentioned. Grandma would love to see the pictures from your vacation!`,
    timestamp: "May 27, 2025 at 7:22 PM",
    recipients: [{ email: "you@email.com", name: "You", type: "to" }],
    labels: ["Family", "Personal", "Weekend Plans"],
  },
  {
    id: 6,
    sender: "AWS",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Your AWS Bill - May 2025",
    preview:
      "Your AWS bill for the period May 1-31, 2025 is now available. This month's usage shows a 15% increase compared to last month, primarily due to increased EC2 instance usage and additional S3 storage.",
    time: "3:00 AM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: true,
    isStarred: false,
    isRead: true,
    priority: "low",
    fullContent: `Dear AWS Customer,

Your AWS bill for the period May 1-31, 2025 is now available. This month's usage shows a 15% increase compared to last month, primarily due to increased EC2 instance usage and additional S3 storage.

**Billing Summary:**
- Total Amount: $1,247.83
- Previous Month: $1,084.20
- Increase: +15.1% ($163.63)

**Top Services by Cost:**
1. EC2 Instances: $687.45 (55.1%)
2. S3 Storage: $234.12 (18.8%)
3. RDS Database: $156.78 (12.6%)
4. CloudFront CDN: $89.34 (7.2%)
5. Other Services: $80.14 (6.4%)

**Usage Highlights:**
- EC2 instance hours increased by 23%
- S3 storage grew by 45GB
- Data transfer increased by 12%

You can view your detailed bill and usage reports in the AWS Billing Console. If you have any questions about your charges, please contact our billing support team.

Thank you for using AWS.

Best regards,
AWS Billing Team`,
    timestamp: "May 28, 2025 at 3:00 AM",
    recipients: [{ email: "billing@yourcompany.com", name: "Billing Department", type: "to" }],
    attachments: [
      { id: "5", name: "AWS_Bill_May_2025.pdf", size: "892 KB", type: "pdf" },
      { id: "6", name: "Usage_Report_May_2025.csv", size: "156 KB", type: "spreadsheet" },
    ],
    labels: ["Billing", "AWS", "Monthly Report"],
  },
  {
    id: 7,
    sender: "Client Success Team",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "URGENT: Account Security Alert",
    preview:
      "We've detected unusual activity on your account. Immediate action required to secure your account. Please review the recent login attempts and update your password if necessary. Our security team is standing by to assist.",
    time: "2:52 PM",
    category: "Urgent",
    categoryColor: "bg-orange-500",
    hasAttachments: false,
    isStarred: false,
    isRead: false,
    priority: "urgent",
    fullContent: `URGENT SECURITY ALERT

We've detected unusual activity on your account. Immediate action required to secure your account. Please review the recent login attempts and update your password if necessary. Our security team is standing by to assist.

**Suspicious Activity Detected:**
- Multiple failed login attempts from unknown IP addresses
- Login attempts from unusual geographic locations
- Attempts to access sensitive account information

**Immediate Actions Required:**
1. Change your password immediately
2. Enable two-factor authentication if not already active
3. Review recent account activity
4. Check for any unauthorized changes to your account settings

**Recent Login Attempts:**
- IP: 192.168.1.100 (Unknown location) - Failed
- IP: 203.45.67.89 (Unknown location) - Failed
- IP: 156.78.90.123 (Unknown location) - Failed

If you recognize this activity, please disregard this message. If not, please take immediate action to secure your account.

For immediate assistance, contact our security team at security@company.com or call our emergency hotline at 1-800-SECURITY.

Best regards,
Client Success Team
Security Department`,
    timestamp: "May 28, 2025 at 2:52 PM",
    recipients: [{ email: "user@email.com", name: "Account Holder", type: "to" }],
    labels: ["Security", "Urgent", "Account Alert"],
  },
  {
    id: 8,
    sender: "Amazon",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Your Amazon Order #302-5739224-13",
    preview:
      "Good news! Your order has shipped and is on its way. You can track your package using the tracking number provided. Expected delivery is within 2-3 business days. Thank you for choosing Amazon Prime.",
    time: "11:15 AM",
    category: "Personal",
    categoryColor: "bg-purple-500",
    hasAttachments: false,
    isStarred: false,
    isRead: true,
    priority: "low",
    fullContent: `Hello,

Good news! Your order has shipped and is on its way. You can track your package using the tracking number provided. Expected delivery is within 2-3 business days. Thank you for choosing Amazon Prime.

**Order Details:**
- Order Number: #302-5739224-13
- Order Date: May 26, 2025
- Ship Date: May 28, 2025
- Expected Delivery: May 30-31, 2025

**Items Shipped:**
1. Wireless Bluetooth Headphones - Sony WH-1000XM5
   Quantity: 1
   Price: $399.99

2. USB-C Charging Cable (3-pack)
   Quantity: 1
   Price: $24.99

**Shipping Information:**
- Carrier: UPS
- Tracking Number: 1Z999AA1234567890
- Shipping Address: 123 Main St, Anytown, ST 12345

You can track your package at: ups.com/tracking

If you have any questions about your order, please visit Your Orders in Your Account or contact Customer Service.

Thank you for shopping with Amazon!

The Amazon Team`,
    timestamp: "May 28, 2025 at 11:15 AM",
    recipients: [{ email: "customer@email.com", name: "Customer", type: "to" }],
    labels: ["Shopping", "Order Confirmation", "Amazon"],
  },
]

export const getSidebarItems = (currentPage: string): SidebarItem[] => [
  { icon: Mail, label: "Email", active: currentPage === "email", count: 12 },
  { icon: Calendar, label: "Calendar", active: currentPage === "calendar", count: 3 },
  { icon: BarChart3, label: "Insights", active: currentPage === "insights", count: null },
]

export const folderItems: FolderItem[] = [
  { icon: Inbox, label: "Inbox", count: 12 },
  { icon: Send, label: "Sent", count: null },
  { icon: Star, label: "Starred", count: 3 },
  { icon: Archive, label: "Archive", count: null },
  { icon: Trash2, label: "Trash", count: null },
]
