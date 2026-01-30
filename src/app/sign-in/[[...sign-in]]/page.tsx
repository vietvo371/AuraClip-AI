import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại</h1>
                    <p className="text-muted-foreground">
                        Đăng nhập để tiếp tục với AuraClip AI
                    </p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
                            card: "shadow-xl",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton:
                                "border-2 hover:bg-accent",
                            formFieldInput:
                                "border-2 focus:border-primary",
                            footerActionLink: "text-primary hover:text-primary/80",
                        },
                    }}
                />
            </div>
        </div>
    );
}
